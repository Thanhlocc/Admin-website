using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AngularProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class SecondMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
        }
    }
}
