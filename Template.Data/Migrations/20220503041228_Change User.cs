using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Template.Data.Migrations
{
    public partial class ChangeUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c7dce21b-d207-4869-bf5f-08eb138bb919"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "Password", "UpdatedDate" },
                values: new object[] { new Guid("e5d33252-cab3-4138-a7ac-ee84bbabbc12"), "admin@teste.com", "Admin", "7C4A8D09CA3762AF61E59520943DC26494F8941B", null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("e5d33252-cab3-4138-a7ac-ee84bbabbc12"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "Password", "UpdatedDate" },
                values: new object[] { new Guid("c7dce21b-d207-4869-bf5f-08eb138bb919"), "admin@teste.com", "Admin", "8D66A53A381493BEC08DA23CEF5A43767F20A42C", null });
        }
    }
}
