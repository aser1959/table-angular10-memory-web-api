import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-animal',
  templateUrl: './add-animal.component.html',
  styleUrls: ['./add-animal.component.scss']
})
export class AddAnimalComponent implements OnDestroy {

  formChanged = false;

  form = this.fb.group({
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
  subscriptions = this.form.valueChanges.subscribe(v => this.handleFormChanged());

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string[],
    private fb: FormBuilder,
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private handleFormChanged(): void {
    this.formChanged = true;
  }

}
