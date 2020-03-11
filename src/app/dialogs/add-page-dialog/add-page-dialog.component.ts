import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
  NgForm, ValidatorFn, ValidationErrors
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
//import {NgxXml2jsonService} from 'ngx-xml2json';
import * as _ from 'lodash';

import {GetService} from '../../services/get.service';
import {CreateService} from '../../services/create.service';
import {MessageService} from '../../services/message.service';

import {
  ChooseObservatoryPagesDialogComponent
} from '../choose-observatory-pages-dialog/choose-observatory-pages-dialog.component';

import {
  AddPagesProgressDialogComponent
} from '../add-pages-progress-dialog/add-pages-progress-dialog.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class UriValidation {

  static validUris(AC: AbstractControl) {
    const domain = AC.get('domain').value;
    let uris = AC.get('uris').value;
    if (_.trim(domain) === '') {
      return null;
    }

    if (_.trim(uris) !== '') {
      uris = _.without(_.uniq(_.split(uris, '\n')), '');
      const size = _.size(uris);
      let hasError = false;
      for (let i = 0; i < size; i++) {
        let url = _.replace(uris[i], 'http://', '');
        url = _.replace(url, 'https://', '');
        url = _.replace(url, 'www.', '');

        if (!_.startsWith(url, domain)) {
          AC.get('uris').setErrors({'invalidUri': true});
          hasError = true;
        }
      }
      if (!hasError) {
        return null;
      }
    } else {
      return null;
    }
  }
}

export const atLeastOne = (validator: ValidatorFn, controls: string[]) => (group: FormGroup): ValidationErrors | null => {
  const hasAtLeastOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]));
  return hasAtLeastOne ? null : {'requiredAtLeastOne': true};
};

@Component({
  selector: 'app-add-page-dialog',
  templateUrl: './add-page-dialog.component.html',
  styleUrls: ['./add-page-dialog.component.css']
})
export class AddPageDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingDomains: boolean;
  loadingCreate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredDomains: Observable<string[]>;

  domains: any;

  pageForm: FormGroup;

  urisFromFile: string[];
  urisFromFileString: string;
  fileErrorMessage: string;

  fileLoading: boolean;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(
    private get: GetService,
    private create: CreateService,
    private message: MessageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPageDialogComponent>,
    //private xml2Json: NgxXml2jsonService
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.pageForm = this.formBuilder.group({
        domain: new FormControl('', [
          Validators.required,
          this.domainValidator.bind(this)
        ]),
        uris: new FormControl(),
        files: new FormControl(),
        observatorio: new FormControl()
      },
      {
        validator: Validators.compose([UriValidation.validUris, atLeastOne(Validators.required, ['uris', 'files'])])
      });
    this.loadingDomains = true;
    this.loadingCreate = false;
    this.fileLoading = false;
    this.urisFromFile = [];
  }

  ngOnInit(): void {
    this.get.listOfOfficialDomains()
      .subscribe(domains => {
        if (domains !== null) {
          this.domains = domains;
          this.filteredDomains = this.pageForm.controls.domain.valueChanges
            .pipe(
              startWith(null),
              map(val => this.filterDomain(val))
            );
        }

        this.loadingDomains = false;
      });
    this.urisFromFileString = '';
    this.fileErrorMessage = '';
  }

  resetForm(): void {
    this.fileErrorMessage = '';
    this.urisFromFile = [];
    this.pageForm.reset();
  }

  resetFile(): void {
    this.fileErrorMessage = '';
    this.urisFromFile = [];
    this.pageForm.controls.files.reset();
  }

  createPage(e): void {
    e.preventDefault();

    const domainId = _.find(this.domains, ['Url', this.pageForm.value.domain]).DomainId;

    this.pageForm.value.uris = this.pageForm.value.uris === null ? '' : this.pageForm.value.uris;
    const urisWithFileUris = [...this.urisFromFile, ..._.split(this.pageForm.value.uris, '\n')];
    // this.urisFromFile.join('\n') + this.pageForm.value.uris;

    const uris = JSON.stringify(_.without(_.uniq(_.map(urisWithFileUris, p => {
      p = _.trim(p);
      p = _.replace(p, 'http://', '');
      p = _.replace(p, 'https://', '');
      p = _.replace(p, 'www.', '');

      if (p[_.size(p) - 1] === '/') {
        p = p.substring(0, _.size(p) - 1);
      }

      return _.trim(p);
    })), ''));

    if (this.pageForm.value.observatorio) {
      const chooseDialog = this.dialog.open(ChooseObservatoryPagesDialogComponent, {
        width: '40vw',
        data: {
          uris: JSON.parse(uris)
        }
      });

      chooseDialog.afterClosed().subscribe(result => {
        if (!result.cancel) {
          this.dialog.open(AddPagesProgressDialogComponent, {
            width: '40vw',
            disableClose: true,
            data: {
              domainId: domainId,
              uris: JSON.parse(uris),
              observatory_uris: JSON.parse(result.uris)
            }
          });
          //this.addPages(domainId, uris, result.uris);
          this.dialogRef.close();
        }
      });
    } else {
      this.dialog.open(AddPagesProgressDialogComponent, {
        width: '40vw',
        disableClose: true,
        data: {
          domainId: domainId,
          uris: JSON.parse(uris),
          observatory_uris: []
        }
      });
      //this.addPages(domainId, uris, JSON.stringify([]));
      this.dialogRef.close();
    }
  }

  private addPages(domainId: number, uris: any, observatorio: any): void {
    this.loadingCreate = true;

    const formData = {
      domainId,
      uris,
      observatorio
    };

    this.create.newPages(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.message.show('PAGES_PAGE.ADD.messages.success');

            if (this.location.path() !== '/console/pages') {
              this.router.navigateByUrl('/console/pages');
            } else {
              window.location.reload();
            }

            this.dialogRef.close();
          }
        }
        this.loadingCreate = false;
      });
  }

  filterDomain(val: any): string[] {
    return this.domains.filter(domain =>
      _.includes(_.toLower(domain.Url), _.toLower(val)));
  }

  domainValidator(control: AbstractControl): any {
    const val = control.value;
    if (val !== '' && val !== null) {
      return _.includes(_.map(this.domains, 'Url'), val) ? null : {'validDomain': true};
    } else {
      return null;
    }
  }

  handleFileInput(files: FileList) {
    this.fileLoading = true;
    const fileToRead = files.item(0);
    this.urisFromFile = [];
    if (fileToRead === null) {
      this.fileErrorMessage = '';
      this.urisFromFile = [];
      this.pageForm.controls.files.reset();
      return;
    }

    switch (fileToRead.type) {
      case ('text/plain'):
        //this.urisFromFile = this.parseTXT(fileToRead);
        this.parseTXT(fileToRead);
        break;
      case ('text/xml'):
        //this.urisFromFile = this.parseXML(fileToRead);
        this.parseXML(fileToRead);
        break;
      default:
        this.urisFromFile = [];
        this.fileErrorMessage = 'invalidType';
        break;
    }
  }

  parseTXT(file: File): string[] {
    const result = [];
    // open file and check for the urls
    const reader = new FileReader();
    reader.readAsText(file);
    // divide the url in the result array
    reader.onload = () => {
      const urlFile = reader.result.toString();
      const lines = _.without(_.map(urlFile.split('\n'), l => _.trim(l)), '');

      /*for (let i = 1; i < lines.length - 1; i++) {
        result.push(lines[i]);
        this.urisFromFile.push(lines[i]);
      }*/
      this.urisFromFile = _.clone(lines);
      this.validateFileUris(this.pageForm.value.domain, this.urisFromFile);
      this.fileLoading = false;
    };
    return result;
  }

  parseXML(file: File): string[] {
    const reader = new FileReader();
    const result = [];
    reader.readAsText(file);
    reader.onload = () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(reader.result.toString(), 'text/xml');
      const json = {}; // this.xml2Json.xmlToJson(xml);
      const urlJson = json['urlset']['url'];

      this.urisFromFile = _.clone(_.map(urlJson, u => u.loc));
      /*console.log(this.urisFromFile);
      this.urisFromFile = [];
      for (let i = 1; i < urlJson.length; i++) {
        result.push(urlJson[i]['loc']);
        this.urisFromFile.push(urlJson[i]['loc']);
      }*/
      this.validateFileUris(this.pageForm.value.domain, this.urisFromFile);
      this.fileLoading = false;
    };
    return result;
  }

  validateFileUris(domain: string, uris: string[]): void {
    if (domain === '') {
      this.fileErrorMessage = 'invalidDomain';
      return;
    }
    if (uris !== undefined || uris !== []) {
      for (let url of uris) {
        url = _.replace(url, 'http://', '');
        url = _.replace(url, 'https://', '');
        url = _.replace(url, 'www.', '');
        if (!_.startsWith(url, domain)) {
          console.log(url);
          this.fileErrorMessage = 'invalidDomain';
          return;
        } else {
          this.fileErrorMessage = '';
        }
      }
    }
  }

  updateUrisFromFile() {
    if (this.urisFromFile !== undefined) {
      this.validateFileUris(this.pageForm.value.domain, this.urisFromFile);
    }
  }
}
