# Gunakan base image Go
FROM golang:1.20

# Set working directory
WORKDIR /app

# Copy semua file ke dalam image
COPY . .

# Download dependencies
RUN go mod tidy

# Build binary (optional, bisa langsung run tanpa build juga)
# RUN go build -o main .

# Jalankan aplikasi
CMD ["go", "run", "main.go"]
