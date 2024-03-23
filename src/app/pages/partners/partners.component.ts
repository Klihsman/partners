import { Component, Inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import Partners from 'src/app/models/partners';
import { PartnersService } from 'src/app/services/partners-service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent {
  displayedColumns: string[] = [
    'createdAt',
    'name',
    'description',
    'repositoryGit',
    'urlDoc',
    ' ',
  ];
  dataSource = new MatTableDataSource<Partners>();
  currentPage: number = 0;
  currentUrl: string = '';

  constructor(
    private PartnersService: PartnersService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = params['page'];
      if (page) {
        this.currentPage = +page;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.pageIndex = this.currentPage;
        }
      }
    });

    this.currentUrl = window.location.href;

    this.PartnersService.PartnersList().subscribe((data) => {
      this.dataSource.data = data.body || [];
    });
  }

  openDeleteDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    element: Partners
  ): void {
    this.dialog.open(DialogDelete, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: element,
    });
  }

  openRegisterPartnersDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    this.dialog.open(DialogRegisterPartners, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openEditPartnersDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    element: Partners
  ): void {
    this.dialog.open(DialogEditPartners, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: element,
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.updateQueryParam('page', this.currentPage);
  }

  private updateQueryParam(param: string, value: any) {
    const queryParams = { ...this.route.snapshot.queryParams };
    queryParams[param] = value;
    this.router.navigate([], { queryParams });
    this.currentUrl = this.getCurrentUrlWithParams();
  }

  copyUrlToClipboard() {
    this.currentUrl = this.getCurrentUrlWithParams();
    const el = document.createElement('textarea');
    el.value = this.currentUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  private getCurrentUrlWithParams(): string {
    const baseUrl = window.location.origin + window.location.pathname;
    const queryParams = this.route.snapshot.queryParams;
    const queryParamsString = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join('&');
    return `${baseUrl}?${queryParamsString}`;
  }
}

@Component({
  selector: 'dialog-delete-modal',
  templateUrl: 'dialog-delete-modal.html',
  standalone: true,
  imports: [MaterialModule],
})
export class DialogDelete {
  constructor(
    public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: Partners,
    private PartnersService: PartnersService
  ) {}

  delete() {
    if (this.data.id) {
      this.PartnersService.DeletePartners(this.data.id).subscribe(() => {
        console.log('Usuário deletado com sucesso');
      });
    }
  }
}

@Component({
  selector: 'dialog-register-partners',
  templateUrl: 'dialog-register-partners.html',
  standalone: true,
  imports: [MaterialModule, FormsModule],
})
export class DialogRegisterPartners {
  name: string = '';
  description?: string;
  repositoryGit?: string;
  urlDoc?: string;

  constructor(
    public dialogRef: MatDialogRef<DialogRegisterPartners>,
    @Inject(MAT_DIALOG_DATA) public data: Partners,
    private PartnersService: PartnersService
  ) {}

  register() {
    this.PartnersService.RegisterPartners({
      name: this.name,
      description: this.description,
      repositoryGit: this.repositoryGit,
      urlDoc: this.urlDoc,
    }).subscribe(() => {
      console.log('Usuário cadastrado com sucesso');
    });
  }
}
@Component({
  selector: 'dialog-edit-partners.html',
  templateUrl: 'dialog-edit-partners.html',
  standalone: true,
  imports: [MaterialModule, FormsModule],
})
export class DialogEditPartners {
  name: string = this.data.name;
  description?: string = this.data.description;
  repositoryGit?: string = this.data.repositoryGit;
  urlDoc?: string = this.data.urlDoc;

  constructor(
    public dialogRef: MatDialogRef<DialogEditPartners>,
    @Inject(MAT_DIALOG_DATA) public data: Partners,
    private PartnersService: PartnersService
  ) {}

  update() {
    this.PartnersService.UpdatePartners({
      name: this.name,
      id: this.data.id,
      description: this.description,
      repositoryGit: this.repositoryGit,
      urlDoc: this.urlDoc,
    }).subscribe(() => {
      console.log('Usuário atualizazdo com sucesso');
    });
  }
}
