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
import { ObserversModule } from '@angular/cdk/observers';
import { NgxGaugeModule } from 'ngx-gauge';
import { HighlightModule } from 'ngx-highlightjs';

import { CookieService } from 'ngx-cookie-service';

import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminConsoleComponent } from './pages/admin-console/admin-console.component';
import { UserAuthErrorDialogComponent } from './dialogs/user-auth-error-dialog/user-auth-error-dialog.component';
import { BreadcrumbsComponent } from './pages/admin-console/breadcrumbs/breadcrumbs.component';
import { NavbarComponent } from './pages/admin-console/navbar/navbar.component';
import { UsersComponent } from './pages/users/users.component';
import { HomeComponent } from './pages/home/home.component';
import { ListOfUsersComponent } from './pages/users/list-of-users/list-of-users.component';
import { WebsitesComponent } from './pages/websites/websites.component';
import { ListOfWebsitesComponent } from './pages/websites/list-of-websites/list-of-websites.component';
import { NotFound404Component } from './pages/not-found-404/not-found-404.component';
import { ConfirmAdditionDialogComponent } from './dialogs/confirm-addition-dialog/confirm-addition-dialog.component';
import { EntitiesComponent } from './pages/entities/entities.component';
import { ListOfEntitiesComponent } from './pages/entities/list-of-entities/list-of-entities.component';
import { DomainsComponent } from './pages/domains/domains.component';
import { ListOfDomainsComponent } from './pages/domains/list-of-domains/list-of-domains.component';
import { PagesComponent } from './pages/pages/pages.component';
import { ListOfPagesComponent } from './pages/pages/list-of-pages/list-of-pages.component';
import { TagsComponent } from './pages/tags/tags.component';
import { ListOfTagsComponent } from './pages/tags/list-of-tags/list-of-tags.component';
import { AddTagDialogComponent } from './dialogs/add-tag-dialog/add-tag-dialog.component';
import { BottomSheetComponent } from './dialogs/bottom-sheet/bottom-sheet.component';
import { AddUserDialogComponent } from './dialogs/add-user-dialog/add-user-dialog.component';
import { AddEntityDialogComponent } from './dialogs/add-entity-dialog/add-entity-dialog.component';
import { AddWebsiteDialogComponent } from './dialogs/add-website-dialog/add-website-dialog.component';
import { AddDomainDialogComponent } from './dialogs/add-domain-dialog/add-domain-dialog.component';
import { AddPageDialogComponent } from './dialogs/add-page-dialog/add-page-dialog.component';
import { EditEntityDialogComponent } from './dialogs/edit-entity-dialog/edit-entity-dialog.component';
import { LoadingComponent } from './global/loading/loading.component';
import { ErrorComponent } from './global/error/error.component';

import { AdminAuthGuard } from './guards/admin-auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

import { HtmlPipe } from './pipes/html.pipe';
import { ToFixedPipe } from './pipes/to-fixed.pipe';
import { EntityComponent } from './pages/entity/entity.component';
import { TagComponent } from './pages/tag/tag.component';
import { UserComponent } from './pages/user/user.component';
import { WebsiteComponent } from './pages/website/website.component';
import { DomainComponent } from './pages/domain/domain.component';
import { PageComponent } from './pages/page/page.component';
import { ListOfEvaluationsComponent } from './pages/page/list-of-evaluations/list-of-evaluations.component';
import { EvaluationResultsComponent } from './pages/evaluation-results/evaluation-results.component';
import { ElementResultComponent } from './pages/element-result/element-result.component';
import { WebpageCodeComponent } from './pages/webpage-code/webpage-code.component';
import { ItemComponent } from './pages/home/item/item.component';
import { EditTagDialogComponent } from './dialogs/edit-tag-dialog/edit-tag-dialog.component';
import { EditUserDialogComponent } from './dialogs/edit-user-dialog/edit-user-dialog.component';
import { DeletePageDialogComponent } from './dialogs/delete-page-dialog/delete-page-dialog.component';
import { DeleteDomainDialogComponent } from './dialogs/delete-domain-dialog/delete-domain-dialog.component';
import { DeleteEvaluationDialogComponent } from './dialogs/delete-evaluation-dialog/delete-evaluation-dialog.component';
import { EditWebsiteDialogComponent } from './dialogs/edit-website-dialog/edit-website-dialog.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'console', component: AdminConsoleComponent, canActivate: [AdminAuthGuard], children: [
    { path: '', component: HomeComponent },
    { path: 'users', component: UsersComponent },
    { path: 'user/:user', component: UserComponent },
    { path: 'tags', component: TagsComponent },
    { path: 'tag/:user/:tag', component: TagComponent },
    { path: 'entities', component: EntitiesComponent },
    { path: 'entity/:entity', component: EntityComponent },
    { path: 'websites', component: WebsitesComponent },
    { path: 'website/:user/:website', component: WebsiteComponent },
    { path: 'domains', component: DomainsComponent },
    { path: 'domain/:user/:domain', component: DomainComponent },
    { path: 'pages', component: PagesComponent },
    { path: 'page/:page', component: PageComponent },
    { path: 'page/:page/:evaluation_date', component: EvaluationResultsComponent },
    { path: 'page/:page/:evaluation_date/code', component: WebpageCodeComponent },
    { path: 'page/:page/:evaluation_date/:ele', component: ElementResultComponent }
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
    UsersComponent,
    HomeComponent,
    ListOfUsersComponent,
    WebsitesComponent,
    ListOfWebsitesComponent,
    NotFound404Component,
    ConfirmAdditionDialogComponent,
    EntitiesComponent,
    ListOfEntitiesComponent,
    DomainsComponent,
    ListOfDomainsComponent,
    PagesComponent,
    ListOfPagesComponent,
    TagsComponent,
    ListOfTagsComponent,
    AddTagDialogComponent,
    BottomSheetComponent,
    AddUserDialogComponent,
    AddEntityDialogComponent,
    AddWebsiteDialogComponent,
    AddDomainDialogComponent,
    AddPageDialogComponent,
    EditEntityDialogComponent,
    LoadingComponent,
    ErrorComponent,
    HtmlPipe,
    ToFixedPipe,
    EntityComponent,
    TagComponent,
    UserComponent,
    WebsiteComponent,
    DomainComponent,
    PageComponent,
    ListOfEvaluationsComponent,
    EvaluationResultsComponent,
    ElementResultComponent,
    WebpageCodeComponent,
    ItemComponent,
    EditTagDialogComponent,
    EditUserDialogComponent,
    DeletePageDialogComponent,
    DeleteDomainDialogComponent,
    DeleteEvaluationDialogComponent,
    EditWebsiteDialogComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ObserversModule,
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
    }),
    NgxGaugeModule,
    HighlightModule.forRoot()
  ],
  entryComponents: [
    UserAuthErrorDialogComponent,
    AddUserDialogComponent,
    AddTagDialogComponent,
    AddEntityDialogComponent,
    AddWebsiteDialogComponent,
    AddDomainDialogComponent,
    AddPageDialogComponent,
    EditEntityDialogComponent,
    EditUserDialogComponent,
    EditTagDialogComponent,
    EditWebsiteDialogComponent,
    DeleteDomainDialogComponent,
    DeletePageDialogComponent,
    DeleteEvaluationDialogComponent,
    BottomSheetComponent
  ],
  providers: [
    AdminAuthGuard,
    NoAuthGuard,
    CookieService,
  	{
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
