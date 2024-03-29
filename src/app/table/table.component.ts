import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { finalize } from 'rxjs/operators';
import { Animal } from '../models/table';
import { TableService } from '../service/table.service';
import { AddAnimalComponent } from './add-animal/add-animal.component';
import { ConfirmComponent } from '../shared/confirm/confirm.component';

@Component({
  selector: 'app-root',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  private formChanged = false;

  @ViewChild('animalsTable', {static: true}) animalsTable: MatTable<any>;

  columns = [
    'id',
    'newGroupId',
    'newGroupName',
    'currentGroupId',
    'currentGroupName',
    'healthIndex',
    'heatIndexPeak',
    'destinationGroup',
    'destinationGroupName',
    'birthDateCalculated',
    'calvingEase',
    'oldLactationNumber',
    'endDate',
    'minValueDateTime',
    'alertType',
    'duration',
    'originalStartDateTime',
    'endDateTime',
    'daysInPregnancy',
    'type',
    'cowId',
    'cowEntryStatus',
    'animalId',
    'deletable',
    'lactationNumber',
    'daysInLactation',
    'ageInDays',
    'startDateTime',
    'reportingDateTime',
    'newborns',
    'sire',
    'breedingNumber',
    'isOutOfBreedingWindow',
    'interval',
    'actions'
  ];
  isEdit = false;
  animals: Animal[];
  form = this.fb.group({
    id: [null],
    newGroupId: [null],
    newGroupName: [null],
    currentGroupId: [null],
    currentGroupName: [null],
    healthIndex: [null],
    heatIndexPeak: [null],
    destinationGroup: [null],
    destinationGroupName: [null],
    birthDateCalculated: [null],
    calvingEase: [null],
    oldLactationNumber: [null],
    endDate: [null],
    minValueDateTime: [null],
    alertType: [null],
    duration: [null],
    originalStartDateTime: [null],
    endDateTime: [null],
    daysInPregnancy: [null],
    type: [null],
    cowId: [null],
    cowEntryStatus: [null],
    animalId: [null],
    deletable: [null],
    lactationNumber: [null],
    daysInLactation: [null],
    ageInDays: [null],
    startDateTime: [null],
    reportingDateTime: [null],
    newborns: [null],
    sire: [null],
    breedingNumber: [null],
    isOutOfBreedingWindow: [null],
    interval: [null],
  });
  subscriptions = [
    this.form.valueChanges.subscribe(v => this.handleFormChanged(v)),
  ];

  constructor(
    private fb: FormBuilder,
    private tableService: TableService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getTable();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  handleRowEditClick(row: Animal): void {
    if (this.isEdit) {
      return;
    }
    row.isEdit = true;
    this.isEdit = true;
    this.form.patchValue({
      id: row.id ?? null,
      newGroupId: row.newGroupId ?? null,
      newGroupName: row.newGroupName ?? null,
      currentGroupId: row.currentGroupId ?? null,
      currentGroupName: row.currentGroupName ?? null,
      healthIndex: row.healthIndex ?? null,
      heatIndexPeak: row.heatIndexPeak ?? null,
      destinationGroup: row.destinationGroup ?? null,
      destinationGroupName: row.destinationGroupName ?? null,
      birthDateCalculated: row.birthDateCalculated ?? null,
      calvingEase: row.calvingEase ?? null,
      oldLactationNumber: row.oldLactationNumber ?? null,
      endDate: row.endDate ?? null,
      minValueDateTime: row.minValueDateTime ?? null,
      alertType: row.alertType ?? null,
      duration: row.duration ?? null,
      originalStartDateTime: row.originalStartDateTime ?? null,
      endDateTime: row.endDateTime ?? null,
      daysInPregnancy: row.daysInPregnancy ?? null,
      type: row.type ?? null,
      cowId: row.cowId ?? null,
      cowEntryStatus: row.cowEntryStatus ?? null,
      animalId: row.animalId ?? null,
      deletable: row.deletable ?? null,
      lactationNumber: row.lactationNumber ?? null,
      daysInLactation: row.daysInLactation ?? null,
      ageInDays: row.ageInDays ?? null,
      startDateTime: row.startDateTime ?? null,
      reportingDateTime: row.reportingDateTime ?? null,
      newborns: row.newborns ?? null,
      sire: row.sire ?? null,
      breedingNumber: row.breedingNumber ?? null,
      isOutOfBreedingWindow: row.isOutOfBreedingWindow ?? null,
      interval: row.interval ?? null,
    });
  }

  handleRowDeleteClick(row: Animal): void {
    if (this.isEdit) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { title: 'Confirm', text: 'Want to delete a row?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subscriptions.push(this.tableService.deleteRowTable(row.id).subscribe(
          () => {
            this.animals = this.animals.filter(e => e.id !== row.id);
          })
        );

      }
    });
  }

  handleRowSaveClick(row: Animal): void {
    const editRow = this.form.getRawValue();
    this.subscriptions.push(this.tableService.updateRowTable(editRow).pipe(
      finalize(() => {
        this.form.reset();
        row.isEdit = false;
        this.isEdit = false;
      })
    ).subscribe(
      () => {
        this.animals.forEach(a => {
          if (a.id === editRow.id) {
            editRow.isEdit = false;
            for (const key in editRow) {
              if (Object.prototype.hasOwnProperty.call(editRow, key)) {
                a[key] = editRow[key];
              }
            }
          }
        });
      })
    );
  }

  handleRowCancelClick(row: Animal): void {
    this.form.reset();
    this.isEdit = false;
    if (row) {
      row.isEdit = false;
    }
  }

  addRowModal(): void {
    if (this.isEdit) {
      return;
    }
    const dialogRef = this.dialog.open(AddAnimalComponent, {
      data: this.columns
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addAnimal(result);
      }
    });
  }

  addRow(): void {
    if (!this.formChanged) {
      return;
    }
    this.addAnimal(this.form);
  }

  private getTable(): void {
    this.subscriptions.push(this.tableService.getAnimals().subscribe(animals => {
      animals.forEach(e => {
        e.isEdit = false;
      });
      this.animals = animals;
    }));
  }

  private addAnimal(alimalForm: any): void {
    const animal = alimalForm.getRawValue();
    this.subscriptions.push(this.tableService.addRowTable(animal).subscribe(
      a => {
        this.animals.push(a);
        this.form.reset();
        this.animalsTable.renderRows();
      })
    );
  }

  private handleFormChanged(values: Animal): void {
    this.formChanged = false;
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        if (values[key] !== null && values[key] !== '') {
          this.formChanged = true;
        }
      }
    }
  }

}
