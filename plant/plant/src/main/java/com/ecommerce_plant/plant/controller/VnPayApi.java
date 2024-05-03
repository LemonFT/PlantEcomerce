package com.ecommerce_plant.plant.controller;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecommerce_plant.plant.config.VnPayConfig;

/**
 * @author lemonftdev
 */

@RequestMapping("")
@Controller
public class VnPayApi {

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @PostMapping("/payment/{amount}")
    public ResponseEntity<?> createPay(@PathVariable int amount) throws UnsupportedEncodingException {
        String vnpVersion = "2.1.0";
        String vnpCommand = "pay";
        String orderType = "other";
        String vnpIpAddr = "127.0.0.1";

        String vnpTxnRef = VnPayConfig.getRandomNumber(8);

        String vnpTmnCode = VnPayConfig.VNP_TMN_CODE;

        Map<String, String> vnpParams = new HashMap<>(20);
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_BankCode", "NCB");
        vnpParams.put("vnp_TxnRef", vnpTxnRef);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang:" + vnpTxnRef);
        vnpParams.put("vnp_OrderType", orderType);

        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", VnPayConfig.VNP_RETURN_URL);
        vnpParams.put("vnp_IpAddr", vnpIpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        List fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnpParams.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnpSecureHash = VnPayConfig.hmacSha512(VnPayConfig.SECRET_KEY, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = VnPayConfig.VNP_PAY_URL + "?" + queryUrl;
        return ResponseEntity.ok().body(paymentUrl);
    }

    @GetMapping("/transaction-info")
    public ResponseEntity<?> getTransactionInformation(
            @RequestParam(value = "vnp_TransactionNo") String vnpTransactionNo,
            @RequestParam(value = "vnp_TransactionStatus") String vnpTransactionStatus) {

        String location = (vnpTransactionStatus != null && vnpTransactionStatus.equals("00"))
                ? "http://localhost:3000/cart?vnp_status=200&vnp_transaction_no=" + vnpTransactionNo
                : "http://localhost:3000/cart?vnp_status=400";
        return ResponseEntity.status(HttpStatus.FOUND).header(HttpHeaders.LOCATION, location).build();
    }

    @PostMapping("/refund/{amount}")
    public ResponseEntity<?> refundTransaction(@PathVariable int amount) throws IOException {
        String vnpRequestId = VnPayConfig.getRandomNumber(8);
        String vnpVersion = "2.1.0";
        String vnpIpAddr = "127.0.0.1";
        String vnpCommand = "refund";
        String vnpTmnCode = VnPayConfig.VNP_TMN_CODE;
        String vnpTransactionType = "02";
        String vnpTxnRef = "72967405";
        String vnpAmount = String.valueOf(amount * 100);
        String vnpOrderInfo = "Hoan tien GD OrderId:" + vnpTxnRef;
        String vnpTransactionNo = "14394773";
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpTransactionDate = formatter.format(cld.getTime());
        String vnpCreateBy = "user";

        String vnpCreateDate = formatter.format(cld.getTime());

        Map<String, String> vnpParams = new HashMap<>(25);

        vnpParams.put("vnp_RequestId", vnpRequestId);
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_TransactionType", vnpTransactionType);
        vnpParams.put("vnp_TxnRef", vnpTxnRef);
        vnpParams.put("vnp_Amount", vnpAmount);
        vnpParams.put("vnp_OrderInfo", vnpOrderInfo);

        vnpParams.put("vnp_TransactionNo", vnpTransactionNo);

        vnpParams.put("vnp_TransactionDate", vnpTransactionDate);
        vnpParams.put("vnp_CreateBy", vnpCreateBy);
        vnpParams.put("vnp_CreateDate", vnpCreateDate);
        vnpParams.put("vnp_IpAddr", vnpIpAddr);

        String hashData = String.join("|", vnpRequestId, vnpVersion, vnpCommand, vnpTmnCode,
                vnpTransactionType, vnpTxnRef, vnpAmount, vnpTransactionNo, vnpTransactionDate,
                vnpCreateBy, vnpCreateDate, vnpIpAddr, vnpOrderInfo);

        String vnpSecureHash = VnPayConfig.hmacSha512(VnPayConfig.SECRET_KEY, hashData);

        vnpParams.put("vnp_SecureHash", vnpSecureHash);

        URL url = new URL(VnPayConfig.VNP_API_URL);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());

        wr.writeBytes(vnpParams.toString());
        wr.flush();
        wr.close();
        int responseCode = con.getResponseCode();
        System.out.println("nSending 'POST' request to URL : " + url);
        System.out.println("Post Data : " + vnpParams);
        System.out.println("Response Code : " + responseCode);
        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String output;
        StringBuffer response = new StringBuffer();
        while ((output = in.readLine()) != null) {
            response.append(output);
        }
        in.close();
        System.out.println(response.toString());

        return ResponseEntity.ok().body(vnpParams);
    }
}
