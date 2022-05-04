using AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using Template.Application.Interfaces;
using Template.Application.ViewModels;
using Template.Domain.Entities;
using Template.Domain.Interfaces;
using Template.ExternalSystem.Auth.Services;
using ValidationContext = System.ComponentModel.DataAnnotations.ValidationContext;

namespace Template.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public List<UserViewModel> Get()
        {
            IEnumerable<User> users = _userRepository.GetAll();

            List<UserViewModel> userViewModels = _mapper.Map<List<UserViewModel>>(users);

            return userViewModels;
        }

        public bool Post(UserViewModel userViewModel)
        {
            if (userViewModel.Id != Guid.Empty)
                throw new Exception("UserID must be empty");

            Validator.ValidateObject(userViewModel, new ValidationContext(userViewModel), true);

            User user = _mapper.Map<User>(userViewModel);
            user.Password = EncryptPassword(user.Password);

            _userRepository.Create(user);

            return true;
        }

        public UserViewModel GetById(string id)
        {
            if (!Guid.TryParse(id, out Guid userId))
                throw new Exception("UserID is not valid");

            User user = _userRepository.Find(x => x.Id == userId && !x.IsDeleted);
            if (user == null)
                throw new Exception("User not found");

            return _mapper.Map<UserViewModel>(user);
        }

        public bool Put(UserViewModel userViewModel)
        {
            if (userViewModel.Id == Guid.Empty)
                throw new Exception("ID is invalid");

            User user = _userRepository.Find(x => x.Id == userViewModel.Id && !x.IsDeleted);
            if (user == null)
                throw new Exception("User not found");

            user = _mapper.Map<User>(userViewModel);
            user.Password = EncryptPassword(user.Password);

            _userRepository.Update(user);

            return true;
        }

        public bool Delete(string id)
        {
            if (!Guid.TryParse(id, out Guid userId))
                throw new Exception("UserID is not valid");

            User user = _userRepository.Find(x => x.Id == userId && !x.IsDeleted);
            if (user == null)
                throw new Exception("User not found");

            return _userRepository.Delete(user);
        }

        public UserAuthResponseViewModel Authenticate(UserAuthRequestViewModel user)
        {
            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
                throw new Exception("Email/Password are required.");

            user.Password = EncryptPassword(user.Password);

            User userResult = _userRepository.Find(x => !x.IsDeleted && x.Email.ToLower() == user.Email.ToLower() && x.Password.ToLower() == user.Password.ToLower());
            if (userResult == null)
                throw new Exception("User not found");

            return new UserAuthResponseViewModel(_mapper.Map<UserViewModel>(userResult), TokenService.GenerateToken(userResult));
        }

        private string EncryptPassword(string password)
        {
            HashAlgorithm sha = new SHA1CryptoServiceProvider();

            byte[] encryptedPassword = sha.ComputeHash(Encoding.UTF8.GetBytes(password));

            StringBuilder stringBuilder = new StringBuilder();

            foreach (var caracter in encryptedPassword)
                stringBuilder.Append(caracter.ToString("X2"));

            return stringBuilder.ToString();
        }
    }
}
