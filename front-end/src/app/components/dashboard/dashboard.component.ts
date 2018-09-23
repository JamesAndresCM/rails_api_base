import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSortable, MatTableDataSource, MatSort , MatPaginator } from '@angular/material';
import { UserService } from '../../services/user.service'
import { AlertService } from '../../services/alert.service'
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public users: any[];
  dataSource = new MatTableDataSource(this.users);
  displayedColumns: string[] = ['role','username','email','avatar','actions'];

  isPopupOpened = true;

  applyFilter(filterValue: string) {
    	filterValue = filterValue.trim(); // Remove whitespace
    	filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    	this.dataSource.filter = filterValue;
  	}

  	@ViewChild(MatPaginator) paginator: MatPaginator;
  	@ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getUsers();
  }
  
  getUsers(){
    this.userService.getAll().pipe(first()).subscribe(
      result => {
          this.users = result;
          this.dataSource = new MatTableDataSource(this.users);
	    		this.dataSource.paginator = this.paginator;
	    		this.dataSource.sort = this.sort;
      }
    );
  }

  delUser(id: number, username: string){
    if(window.confirm('Are sure you want to delete user '+ username +'?') == true){
      this.userService.deleteUser(id).pipe(first()).subscribe(
				result => {
					if(result["status"] == 200){
						this.getUsers();
            this.alertService.error("User has been deleted");
					}else{
						console.log("error not del element...");
					}
				},
				error => {
					console.log(<any>error);
				});
		}
  }

  editUser(id: number) {
	    this.isPopupOpened = true;
	    let user_res = this.userService.getById(id).subscribe(
	    	result => { 
          let dialogRef; 
            dialogRef = this.dialog.open(UserEditComponent, {
	    				  data: result
	    		  }),
	    		  dialogRef.afterClosed().subscribe( response =>{
	    				this.isPopupOpened = false;
	    				this.getUsers();
	    			  })
	    		},
	    	  error => {
				  console.log(<any>error);
			  });
  	}

}
