import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { UserService } from './services/user.service';
import { ServerService } from './services/server.service';
import { MessageService } from './services/message.service';

import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { AdminConsoleComponent } from './admin-console/admin-console.component';

import { AdminAuthGuard } from './guards/admin-auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { UserAuthErrorDialogComponent } from './dialogs/user-auth-error-dialog/user-auth-error-dialog.component';
import { BreadcrumbsComponent } from './admin-console/breadcrumbs/breadcrumbs.component';
import { NavbarComponent } from './admin-console/navbar/navbar.component';
import { UsersPageComponent } from './users-page/users-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AddUserComponent } from './users-page/add-user/add-user.component';
import { ListOfUsersComponent } from './users-page/list-of-users/list-of-users.component';
import { WebsitesPageComponent } from './websites-page/websites-page.component';
import { AddWebsiteComponent } from './websites-page/add-website/add-website.component';
import { ListOfWebsitesComponent } from './websites-page/list-of-websites/list-of-websites.component';
import { NotFound404Component } from './not-found-404/not-found-404.component';
import { ConfirmAdditionDialogComponent } from './dialogs/confirm-addition-dialog/confirm-addition-dialog.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'console', component: AdminConsoleComponent, canActivate: [AdminAuthGuard], children: [
    { path: '', component: HomePageComponent },
    { path: 'users', component: UsersPageComponent },
    { path: 'websites', component: WebsitesPageComponent }
  ]}
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true
};

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    AdminConsoleComponent,
    UserAuthErrorDialogComponent,
    BreadcrumbsComponent,
    NavbarComponent,
    UsersPageComponent,
    HomePageComponent,
    AddUserComponent,
    ListOfUsersComponent,
    WebsitesPageComponent,
    AddWebsiteComponent,
    ListOfWebsitesComponent,
    NotFound404Component,
    ConfirmAdditionDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
    UserAuthErrorDialogComponent
  ],
  providers: [
    AdminAuthGuard,
    NoAuthGuard,
    CookieService,
    UserService,
    ServerService,
    MessageService,
  	{
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
