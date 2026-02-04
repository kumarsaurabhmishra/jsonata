package com.jsonata.playground;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.api.jsonata4java.Expression;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EvaluationController {

    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping("/evaluate")
    public Map<String, Object> evaluate(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String expressionStr = (String) request.get("expression");
            Object inputObj = request.get("input");

            JsonNode inputNode = mapper.valueToTree(inputObj);
            Expression expression = Expression.jsonata(expressionStr);
            JsonNode resultNode = expression.evaluate(inputNode);

            response.put("result", mapper.treeToValue(resultNode, Object.class));
            response.put("engine", "JSONata4Java-2.6.0");
            response.put("status", "success");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    @Configuration
    public static class WebConfig implements WebMvcConfigurer {

        @Value("${app.cors.allowed-origins:*}")
        private String allowedOrigins;

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins(allowedOrigins.split(","))
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*");
        }
    }
}
