import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ExoplanetsService, ExoplanetData } from '../../servicios/exoplanets.service';

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

  constructor(private exoplanetsService: ExoplanetsService) { }

  ngOnInit(): void {
    this.exoplanetsService.fetchData().subscribe((data) => {
      this.exoplanetsData = data;
      this.addExoplanetsToScene();
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
      // Convertir RA y DEC a radianes
      const ra = THREE.MathUtils.degToRad(exoplanet.ra);
      const dec = THREE.MathUtils.degToRad(exoplanet.dec);

      // Suponiendo que koi_period podría ser una aproximación de la distancia en años luz
      const distance = exoplanet.koi_period * scale; // Aplicar la escala

      // Calcular coordenadas cartesianas con variaciones aleatorias para crear formas irregulares
      const x = distance * Math.cos(dec) * Math.cos(ra) + (Math.random() - 0.5) * 0.5; // Variación en x
      const y = distance * Math.cos(dec) * Math.sin(ra) + (Math.random() - 0.5) * 0.5; // Variación en y
      const z = distance * Math.sin(dec) + (Math.random() - 0.5) * 0.5; // Variación en z

      vertices.push(x, y, z);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    this.pointCloud = new THREE.Points(geometry, material);
    this.scene.add(this.pointCloud);
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.initThreeJS();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateCanvasSize();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    // Actualiza las coordenadas del ratón
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
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

      // Establece un umbral de distancia
      const threshold = 6.0; // Aumenta este valor si necesitas más distancia

      // Comprobamos si la distancia de intersección es menor que el umbral
      if (intersects[0].distance < threshold) {
        this.showTooltip(exoplanet, intersects[0].point);
      } else {
        this.tooltip.style.display = 'none';
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
}