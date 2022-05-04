using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Template.Data.Migrations
{
    public partial class RemoveIdfromEntitybasemodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PullRequest",
                table: "PullRequest");

            migrationBuilder.RenameTable(
                name: "PullRequest",
                newName: "PullRequests");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "PullRequests",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PullRequests",
                table: "PullRequests",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PullRequests",
                table: "PullRequests");

            migrationBuilder.RenameTable(
                name: "PullRequests",
                newName: "PullRequest");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "PullRequest",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PullRequest",
                table: "PullRequest",
                column: "Id");
        }
    }
}
