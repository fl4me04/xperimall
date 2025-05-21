# Gunakan image Go
FROM golang:1.21

# Set working directory di dalam container
WORKDIR /app

# Copy file dari XperimallBackend ke dalam /app container
COPY . .

# Set go module name agar sesuai
ENV GO111MODULE=on

# Unduh dependensi
RUN go mod tidy

# Jalankan aplikasi
CMD ["go", "run", "main.go"]
