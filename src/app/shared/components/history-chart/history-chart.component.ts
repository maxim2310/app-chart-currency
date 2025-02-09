/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  OnDestroy,
  ViewChild,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import { HistoryService } from '../../../core/services/hystory.service';
import { InstrumentService } from '../../../core/services/instrument.service';
import { Instrument } from '../../models/Instrument';

@Component({
  selector: 'app-history-chart',
  imports: [MatCardModule],
  templateUrl: './history-chart.component.html',
  styleUrl: './history-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryChartComponent implements OnDestroy, OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  private chart!: IChartApi;
  private candlestickSeries!: ISeriesApi<'Candlestick'>;
  private prevInstrument = signal<Instrument | null>(null);
  private firstLoad = true;

  data = computed(() => this.historyService.historyData());

  constructor(
    private historyService: HistoryService,
    private instrumentService: InstrumentService
  ) {
    effect(() => {
      const selectedInstrument = this.instrumentService.selectedInstrument();

      if (
        selectedInstrument &&
        selectedInstrument.id !== this.prevInstrument()?.id
      ) {
        this.prevInstrument.set(selectedInstrument);
        this.historyService.getHistory(selectedInstrument.id).subscribe({
          next: () => {
            this.updateData();
          },
          error: e => console.log(e),
        });
      }
    });
  }

  ngOnInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    this.chart.remove();
  }

  createChart() {
    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.clientWidth,
      height: 400,
      timeScale: {
        visible: true,
      },
      localization: {
        locale: 'en',
      },
    });

    this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    // @ts-ignore
    this.candlestickSeries.setData(this.data());

    this.chart.timeScale().setVisibleLogicalRange({ from: -60, to: 10 });
  }

  updateData() {
    // @ts-ignore
    this.candlestickSeries.setData(this.data());
  }
}
