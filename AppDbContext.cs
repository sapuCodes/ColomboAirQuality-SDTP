using Microsoft.EntityFrameworkCore;
using sdt_backend.net.Models;

namespace sdt_backend.net.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Station> AirQualityStations { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(u => u.Name)
                    .HasMaxLength(100)
                    .IsRequired()
                    .HasColumnType("VARCHAR(100)");

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnType("VARCHAR(255)");

                entity.Property(u => u.Password)
                    .IsRequired()
                    .HasColumnType("TEXT");

                entity.HasIndex(u => u.Email).IsUnique();
            });

            modelBuilder.Entity<Station>(entity =>
            {
                entity.ToTable("air_quality_stations");

                entity.Property(s => s.StationName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnType("VARCHAR(100)");

                entity.Property(s => s.Latitude)
                    .HasColumnType("DECIMAL(10, 6)");

                entity.Property(s => s.Longitude)
                    .HasColumnType("DECIMAL(10, 6)");

                entity.Property(s => s.PM25)
                    .HasColumnType("DECIMAL(5, 1)");

                entity.Property(s => s.CO)
                    .HasColumnType("DECIMAL(5, 1)");

                entity.Property(s => s.Temperature)
                    .HasColumnType("DECIMAL(4, 1)");

                entity.Property(s => s.Humidity)
                    .HasColumnType("DECIMAL(5, 1)");
            });

            modelBuilder.Entity<Admin>(entity =>
            {
                entity.ToTable("admins");

                entity.Property(a => a.Id)
                    .HasColumnName("id")
                    .IsRequired();

                entity.Property(a => a.Username)
                    .HasColumnName("username")
                    .HasMaxLength(50)
                    .IsRequired()
                    .HasColumnType("VARCHAR(50)");

                entity.Property(a => a.PasswordHash)
                    .HasColumnName("password_hash")
                    .IsRequired()
                    .HasColumnType("TEXT");

                entity.HasIndex(a => a.Username).IsUnique();
            });

            modelBuilder.Entity<Contact>(entity =>
            {
                entity.ToTable("contacts");

                entity.Property(c => c.Name)
                    .HasMaxLength(100)
                    .IsRequired()
                    .HasColumnType("VARCHAR(100)");

                entity.Property(c => c.Phone)
                    .HasMaxLength(20)
                    .IsRequired()
                    .HasColumnType("VARCHAR(20)");

                entity.Property(c => c.Email)
                    .HasMaxLength(100)
                    .IsRequired()
                    .HasColumnType("VARCHAR(100)");

                entity.Property(c => c.Message)
                    .IsRequired()
                    .HasColumnType("TEXT");

                entity.Property(c => c.SubmittedAt)
                    .HasDefaultValueSql("NOW()")
                    .HasColumnType("TIMESTAMP WITH TIME ZONE");
            });
        }
    }
}