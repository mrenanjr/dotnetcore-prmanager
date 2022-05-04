using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Domain.Models
{
    public class Entity
    {
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
