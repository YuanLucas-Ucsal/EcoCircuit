package com.ecocircuit.eco.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class NavegacaoController {

    @GetMapping("/EcoCircuit")
    public String index() {
        System.out.println("Acessou a rota /EcoCircuit");
        return "forward:/index.html"; 
    }
}