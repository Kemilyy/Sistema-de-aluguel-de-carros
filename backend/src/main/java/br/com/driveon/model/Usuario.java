package br.com.driveon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nome;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String senha;

  @Column(nullable = false)
  private String tipo;

  private String cpf;
  private String rg;
  private String endereco;
  private String profissao;

  @OneToMany(mappedBy = "cliente", fetch = FetchType.EAGER)
  private List<Rendimento> rendimentos = new ArrayList<>();

  protected Usuario() {}

  public Usuario(String nome, String email, String senha, String tipo) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.tipo = tipo;
  }

  public Long getId() {
    return id;
  }

  public String getNome() {
    return nome;
  }

  public String getEmail() {
    return email;
  }

  @JsonIgnore
  public String getSenha() {
    return senha;
  }

  public String getTipo() {
    return tipo;
  }

  public String getCpf() {
    return cpf;
  }

  public String getRg() {
    return rg;
  }

  public String getEndereco() {
    return endereco;
  }

  public String getProfissao() {
    return profissao;
  }

  public List<Rendimento> getRendimentos() {
    return rendimentos;
  }

  public void setNome(String v) {
    nome = v;
  }

  public void setEmail(String v) {
    email = v;
  }

  public void setSenha(String v) {
    senha = v;
  }

  public void setTipo(String v) {
    tipo = v;
  }

  public void setCpf(String v) {
    cpf = v;
  }

  public void setRg(String v) {
    rg = v;
  }

  public void setEndereco(String v) {
    endereco = v;
  }

  public void setProfissao(String v) {
    profissao = v;
  }
}
