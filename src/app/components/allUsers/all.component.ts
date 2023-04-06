import { Input, Component } from '@angular/core';
import { AccountService } from 'app/_services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-all',
    templateUrl: './all.component.html',
    styleUrls: []
})

export class AllComponent {
    users = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id) 
            });
    }
}