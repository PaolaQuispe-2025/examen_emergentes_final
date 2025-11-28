import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotellasComponent } from './botellas.component';

describe('BotellasComponent', () => {
  let component: BotellasComponent;
  let fixture: ComponentFixture<BotellasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotellasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotellasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
