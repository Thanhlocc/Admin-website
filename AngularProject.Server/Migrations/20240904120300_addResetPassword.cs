using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AngularProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class addResetPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "86bf0d10-67be-4979-bdf6-4b4b4a30bace");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9905e2cb-3c27-4e85-a40c-fc4660019d21");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "99fda710-c2d2-497a-b757-925de9bf81c9");

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetPasswordExpiry",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ResetPasswordToken",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4d2bf671-f83d-4407-9a09-0f71fff8bedd", null, "seller", "seller" },
                    { "4dc59606-6974-43fd-a00a-f349e7da63a2", null, "admin", "admin" },
                    { "569a85f8-d8ec-415d-b249-2ce00e7756ac", null, "client", "client" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4d2bf671-f83d-4407-9a09-0f71fff8bedd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4dc59606-6974-43fd-a00a-f349e7da63a2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "569a85f8-d8ec-415d-b249-2ce00e7756ac");

            migrationBuilder.DropColumn(
                name: "ResetPasswordExpiry",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ResetPasswordToken",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "86bf0d10-67be-4979-bdf6-4b4b4a30bace", null, "client", "client" },
                    { "9905e2cb-3c27-4e85-a40c-fc4660019d21", null, "seller", "seller" },
                    { "99fda710-c2d2-497a-b757-925de9bf81c9", null, "admin", "admin" }
                });
        }
    }
}
