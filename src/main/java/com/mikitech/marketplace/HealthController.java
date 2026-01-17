package com.mikitech.marketplace;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        try (Connection conn = dataSource.getConnection()) {
            status.put("database", "MySQL Connected (" + conn.getCatalog() + ")");
        } catch (Exception e) {
            status.put("database", "Disconnected: " + e.getMessage());
        }
        return status;
    }
}
