import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  user: FormGroup;
  chosenRole;

  ngOnInit() {
    this.user = new FormGroup({
      name: new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required)
      }),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      // TODO: SELECT ROLE IN SIGN UP
      role: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
    });
  }

  onSubmit({value, valid}: { value: User, valid: boolean }) {
    value.role = this.chosenRole;
    this.register(value);
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) {

    this.route.queryParams.subscribe(params => {
      this.chosenRole = params['role'];
    });
  }

  register(value: any) {
    this.authService.register(value)
      .subscribe(
        data => {
          this.router.navigate(['/login']);
        },
        error => {
          new Noty({
            type: 'error',
            text: error.msg,
            timeout: 3000,
            progressBar: true
          }).show();
        });
  }

}

export interface User {

  name: {
    firstName: string,
    lastName: string
  };
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  gender: string;
};
