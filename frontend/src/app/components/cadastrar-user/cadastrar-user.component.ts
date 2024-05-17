import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/services/User/user.service';

@Component({
  selector: 'app-cadastrar-user',
  templateUrl: './cadastrar-user.component.html',
  styleUrls: ['./cadastrar-user.component.css']
})
export class CadastrarUserComponent implements OnInit {
  cadastrarUser: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.cadastrarUser = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.cadastrarUser.valid) {
      const { username, password, confirmPassword } = this.cadastrarUser.value;
      if (password === confirmPassword) {
        this.userService.cadastrarUser({ username, password }).subscribe(
          response => {
            this.showSuccessMessage();
            this.cadastrarUser.reset();
          },
          error => {
            console.error('Cadastro falhou', error);
          }
        );
      } else {
        console.error('Senhas não compatíveis');
      }
    }
  }

  showSuccessMessage(): void {
    this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', {
      duration: 3000,
    });
  }
}
