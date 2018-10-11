import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatToolbarModule,MatButtonModule , MatInputModule, MatProgressSpinnerModule, MatCardModule, MatTableModule, MatSortModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatIconModule } from "@angular/material/icon";
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu'
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
	imports: [
		MatButtonModule,
		MatToolbarModule,
		MatInputModule, 
		MatProgressSpinnerModule,
		MatCardModule,
		CdkTableModule,
		MatTableModule,
    MatMenuModule,
		MatSortModule,
		MatPaginatorModule,
		MatSidenavModule,
		MatGridListModule,
		MatIconModule,
		MatDialogModule,
		MatSelectModule,
    MatListModule,
    MatSnackBarModule
	],
	exports: [
		MatButtonModule,
		MatToolbarModule,
		MatInputModule, 
		MatProgressSpinnerModule,
		MatCardModule,
    MatMenuModule,
		CdkTableModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatSidenavModule,
		MatGridListModule,
		MatIconModule,
		MatDialogModule,
		MatSelectModule,
    MatListModule,
    MatSnackBarModule
	]
})

export class MaterialModule{

} 
