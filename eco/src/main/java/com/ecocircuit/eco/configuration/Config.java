package com.ecocircuit.eco.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import com.ecocircuit.eco.model.Pessoa;
import com.ecocircuit.eco.repository.PessoaRepository;

@Configuration
public class Config implements CommandLineRunner {

    @Autowired
    private PessoaRepository pessoaRepository;

    @Override
    public void run(String... args) throws Exception {
        Pessoa pessoa1 = new Pessoa(null, "Yuan", "Sousa", "35021321511");
        Pessoa pessoa2 = new Pessoa(null, "Marcos", "Dessa", "12345678900");
        Pessoa pessoa3 = new Pessoa(null, "Ana", "Silva", "09876543210");
        Pessoa pessoa4 = new Pessoa(null, "Carlos", "Santos", "11223344556");
        Pessoa pessoa5 = new Pessoa(null, "Maria", "Oliveira", "77889900112");

        pessoaRepository.save(pessoa1);
        pessoaRepository.save(pessoa2);
        pessoaRepository.save(pessoa3);
        pessoaRepository.save(pessoa4);
        pessoaRepository.save(pessoa5);
    }
}