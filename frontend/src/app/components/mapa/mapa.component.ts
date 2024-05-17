import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MapaService } from 'src/services/Mapa/mapa.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CadastrarPontoComponent } from '../cadastrar-ponto/cadastrar-ponto.component';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  mapHtml: SafeResourceUrl | undefined;

  constructor(
    private mapService: MapaService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
    ) { }

  resetInit(){
    this.ngOnInit()
  }

  ngOnInit(): void {
    this.mapService.construirMapa().subscribe(
      data => {
        const html = this.sanitizer.bypassSecurityTrustHtml(data);
        this.createTempHTMLFile(html);
      },
      error => console.error('Erro ao carregar o mapa:', error)
    );
  }

  createTempHTMLFile(html: SafeResourceUrl): void {
    const htmlContent = `<html><head></head><body>${html}</body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    this.mapHtml = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  abrirDialogo() {
    const dialogRefEdit = this.dialog.open(CadastrarPontoComponent, {
      width: '30%',
      data: {},
    });

    dialogRefEdit.afterClosed().subscribe((packageId: string) => {
      this.resetInit()
    });
  }

}
