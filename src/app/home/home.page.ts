import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  fotos: Photo[] = [];

  constructor() {}

  ngOnInit(): void {
    Camera.requestPermissions();
  }

  // Método para tomar una foto
  async takePhoto() {
    await this.getPicture(CameraSource.Camera);
  }

  // Método para seleccionar una foto desde la galería
  async selectFromGallery() {
    await this.getPicture(CameraSource.Photos);
  }

  async getPicture(source: CameraSource) {
    const imagenTomada = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: source,
    });

    if (imagenTomada) {
      this.fotos.unshift(imagenTomada);
      // Guardar la foto en la galería
      await this.savePicture(imagenTomada);
    }
  }

  async savePicture(photo: Photo): Promise<void> {
    if (!photo.base64String) {
      return;
    }

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: photo.base64String,
      directory: Directory.Data,
    });

    let fileUrl: string;
    if (Capacitor.getPlatform() === 'web') {
      // Si es web, usamos la ruta de la imagen guardada directamente
      fileUrl = Capacitor.convertFileSrc(savedFile.uri);
    } else {
      // Si no es web, generamos una URL local para la imagen guardada
      fileUrl = Capacitor.convertFileSrc(savedFile.uri);
    }
  }
}
