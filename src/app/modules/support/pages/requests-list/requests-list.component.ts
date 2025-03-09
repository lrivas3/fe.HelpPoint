import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Slider } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-requests-list',
    imports: [TableModule, Button, IconField, InputIcon, Tag, CurrencyPipe, DatePipe, NgClass, Slider, FormsModule, DropdownModule, InputText],
    templateUrl: './requests-list.component.html',
    styleUrl: './requests-list.component.scss'
})
export class RequestsListComponent implements OnInit {
    customers!: any[];

    representatives!: any[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;

    constructor() {}

    ngOnInit() {
        this.loading = false;
        // this.customerService.getCustomersLarge().then((customers) => {
        //     this.customers = customers;
        //     this.loading = false;
        //
        //     this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
        // });

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    // getSeverity(status: string) {
    //     switch (status.toLowerCase()) {
    //         case 'unqualified':
    //             return 'danger';
    //
    //         case 'qualified':
    //             return 'success';
    //
    //         case 'new':
    //             return 'info';
    //
    //         case 'negotiation':
    //             return 'warn';
    //
    //         case 'renewal':
    //             return null;
    //     }
    // }
    getSeverity(label: string | null | undefined | BufferSource | HTMLLabelElement) {
        return undefined;
    }
}
