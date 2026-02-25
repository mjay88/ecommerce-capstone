package com.capstone.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadProductImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required.");
        }

        String publicId = "capstone/products/" + UUID.randomUUID();

        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "public_id", publicId,
                        "resource_type", "image",
                        "overwrite", true
                )
        );

        // Prefer secure_url
        Object secureUrl = result.get("secure_url");
        if (secureUrl == null) {
            throw new IllegalStateException("Cloudinary upload succeeded but no secure_url was returned.");
        }

        return secureUrl.toString();
    }
}
