package com.ecocircuit.eco.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecocircuit.eco.model.Pessoa;
import com.ecocircuit.eco.repository.PessoaRepository;

@RestController
public class PessoaController {
    
    @Autowired
    private PessoaRepository repository;

    @GetMapping("/usuarios")
    public List<Pessoa> listarPessoas() {
        return repository.findAll();
    }
}