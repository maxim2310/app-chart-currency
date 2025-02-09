import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-history-chart',
  imports: [MatCardModule],
  templateUrl: './history-chart.component.html',
  styleUrl: './history-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryChartComponent { }
