import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ExoplanetsService, ExoplanetData } from '../../servicios/exoplanets.service';
import { ExoclickService } from '../../servicios/exoclick.service';


@Component({
  selector: 'app-exoplanet-sphere',
  template: '<div #canvasContainer style="width: 100%; height: 100vh; position: relative;"></div>',
  styleUrls: ['./exoplanet-sphere.component.scss']
})
export class ExoplanetSphereComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private exoplanetsData: ExoplanetData[] = [];
  private pointCloud!: THREE.Points;
  private tooltip!: HTMLElement;
  private cameraTarget!: THREE.Vector3; // Almacena la posición final del movimiento de la cámara
  private moveSpeed: number = 0.05; // Velocidad del movimiento de la cámara

  constructor(private exoplanetsService: ExoplanetsService, private exoclickService: ExoclickService) { }

  ngOnInit(): void {
    this.exoplanetsService.fetchData().subscribe((data) => {
      this.exoplanetsData = data;
      this.addExoplanetsToScene();
    });
    this.exoplanetsService.selectedExoplanet$.subscribe(exoplanet => {
      if (exoplanet){
        this.moveCameraToExoplanet(exoplanet);
      }
    });

    // Crear el tooltip y agregarlo al DOM
    this.tooltip = document.createElement('div');
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.padding = '8px';
    this.tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.tooltip.style.color = 'white';
    this.tooltip.style.borderRadius = '4px';
    this.tooltip.style.pointerEvents = 'none';
    this.tooltip.style.display = 'none';  // Inicialmente oculto
    document.body.appendChild(this.tooltip);
  }

  private addExoplanetsToScene(): void {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const scale = 0.01; // Escala para convertir años luz a unidades visualizables en pantalla

    this.exoplanetsData.forEach((exoplanet) => {
      const ra = THREE.MathUtils.degToRad(exoplanet.ra);
      const dec = THREE.MathUtils.degToRad(exoplanet.dec);
      const distance = exoplanet.koi_period * scale; // Aplicar la escala

      const x = distance * Math.cos(dec) * Math.cos(ra) + (Math.random() - 0.5) * 0.5;
      const y = distance * Math.cos(dec) * Math.sin(ra) + (Math.random() - 0.5) * 0.5;
      const z = distance * Math.sin(dec) + (Math.random() - 0.5) * 0.5;

      vertices.push(x, y, z);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    this.pointCloud = new THREE.Points(geometry, material);
    this.scene.add(this.pointCloud);
  }

  private moveCameraToExoplanet(exoplanet: ExoplanetData): void {
    const raInRadians = THREE.MathUtils.degToRad(exoplanet.ra);
    const decInRadians = THREE.MathUtils.degToRad(exoplanet.dec);
    const distance = exoplanet.koi_prad * 0.01; // Escala el radio

    const x = distance * Math.cos(decInRadians) * Math.cos(raInRadians);
    const y = distance * Math.cos(decInRadians) * Math.sin(raInRadians);
    const z = distance * Math.sin(decInRadians);

    this.cameraTarget = new THREE.Vector3(x, y, z); // Definimos el objetivo de la cámara
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.initThreeJS();

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();

      // Movimiento suave de la cámara hacia el objetivo
      if (this.cameraTarget) {
        this.camera.position.lerp(this.cameraTarget, this.moveSpeed); // Interpolación suave
        this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // Mantiene la cámara enfocada en el origen
      }

      this.detectIntersections();
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.pointCloud);
    if (intersects.length > 0) {
      const index = intersects[0].index!;
      const exoplanet = this.exoplanetsData[index];
      this.exoclickService.notifyExoplanetClicked(exoplanet); // Notifica cuando se hace clic en un exoplaneta
    }
  }

  private createScene(): void {
    const container = this.canvasContainer.nativeElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.updateCanvasSize();
    container.appendChild(this.renderer.domElement);

    this.camera.position.z = 15;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
    this.controls.enableZoom = true;
  }

  private updateCanvasSize(): void {
    const container = this.canvasContainer.nativeElement;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  initThreeJS(): void {
    const radius = 10;
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    for (let i = 0; i < 100; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
    this.pointCloud = new THREE.Points(geometry, material);
    this.scene.add(this.pointCloud);

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.detectIntersections();
      this.renderer.render(this.scene, this.camera);
    };

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 10);
    this.scene.add(light);

    animate();
  }

  private detectIntersections(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.pointCloud);
    if (intersects.length > 0) {
      const index = intersects[0].index!;
      const exoplanet = this.exoplanetsData[index];
      if (intersects[0].distance < 1000) {
        this.showTooltip(exoplanet, intersects[0].point);
      }
    } else {
      this.tooltip.style.display = 'none';
    }
  }

  private showTooltip(exoplanet: ExoplanetData, point: THREE.Vector3): void {
    this.tooltip.style.display = 'block';
    this.tooltip.innerHTML = `
      <h3>${exoplanet.kepler_name}</h3>
      <p>KOI Period: ${exoplanet.koi_period}</p>
      <p>KOI Prad: ${exoplanet.koi_prad}</p>
    `;
    this.tooltip.style.left = `${this.mouse.x * window.innerWidth / 2 + window.innerWidth / 2 + 10}px`;
    this.tooltip.style.top = `${-this.mouse.y * window.innerHeight / 2 + window.innerHeight / 2 + 10}px`;
  }

  @HostListener('window:resize')
  onResize(): void {
    const container = this.canvasContainer.nativeElement;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
  }

}
