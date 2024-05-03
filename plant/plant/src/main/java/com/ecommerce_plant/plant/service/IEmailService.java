package com.ecommerce_plant.plant.service;

/**
 * @author lemonftdev
 */
public interface IEmailService {
    /**
     * Gửi email đến một địa chỉ cụ thể với chủ đề và nội dung xác định.
     *
     * @param to             Địa chỉ email của người nhận.
     * @param subject        Chủ đề của email.
     * @param messageContent Nội dung của email.
     * @return True nếu email được gửi thành công, ngược lại là false.
     */
    String send(String to, String subject, String message);
}