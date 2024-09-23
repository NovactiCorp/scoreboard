import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

  title = 'scoreboard-template';

  private background!: HTMLElement;
  private billboard!: HTMLElement;
  private sky!: HTMLElement;
  private horses!: NodeListOf<HTMLElement>;
  private horseWidth: number = 131;
  private speed: number = 1;

  private offset: number = 0;
  private frameIndex: number = 0;
  private frameRate: number = 100;
  private lastFrameTime: number = 0;
  private frameCount: number = 10;

  public scoreBoardFloat: boolean = false;

  private intervalId: any;

  horseList = [
    { id: 'horse1', name: 'Janette Hudson', role: 'UI/UX Designer', icon: 'assets/img/icon_01.png', score: 0 },
    { id: 'horse2', name: 'Theresa Webb Hudson', role: 'UI/UX Designer', icon: 'assets/img/icon_02.png', score: 0 },
    { id: 'horse3', name: 'Arlene McCoy', role: 'UI/UX Designer', icon: 'assets/img/icon_03.png', score: 0 },
    { id: 'horse4', name: 'Jacob Jones', role: 'UI/UX Designer', icon: 'assets/img/icon_04.png', score: 0 },
    { id: 'horse5', name: 'Maya Thompson', role: 'UI/UX Designer', icon: 'assets/img/icon_05.png', score: 0 },
    { id: 'horse6', name: 'Oliver Martinez', role: 'UI/UX Designer', icon: 'assets/img/icon_06.png', score: 0 },
    { id: 'horse7', name: 'Sofia Patel', role: 'UI/UX Designer', icon: 'assets/img/icon_07.png', score: 0 },
    { id: 'horse8', name: 'Liam Chen', role: 'UI/UX Designer', icon: 'assets/img/icon_08.png', score: 0 }
  ];

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.intervalId = setInterval(() => this.toogleFloat(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  ngAfterViewInit(): void {


    this.background = this.el.nativeElement.querySelector('.bg_race');
    this.billboard = this.el.nativeElement.querySelector('.billboard');
    this.sky = this.el.nativeElement.querySelector('.sky');
    this.horses = this.el.nativeElement.querySelectorAll('.horse');
    this.startAnimation();

    requestAnimationFrame(this.gameLoop.bind(this));

  }

  private startAnimation(): void {
    setInterval(() => {
      this.updateHorsesPosition();
    }, 3000);
  }


  private updateHorsesPosition(): void {

    const leftValues: number[] = [];

    this.horses.forEach((horse, index) => {

      const randomLeft = Math.random() * 480;

      const randomTopPercentage = 10 + Math.random() * 30;
      const randomTop = `${randomTopPercentage}%`;

      this.renderer.setStyle(horse, 'left', `${randomLeft}px`);
      this.renderer.setStyle(horse, 'top', randomTop);
      horse.style.setProperty('left', `${randomLeft}px`, 'important');

      this.horseList[index].score = parseFloat(randomLeft.toFixed(1));
      leftValues.push(randomLeft);

    });

    this.horseList.sort((a, b) => {

      const aIndex = parseInt(a.id.replace('horse', '')) - 1;
      const bIndex = parseInt(b.id.replace('horse', '')) - 1;

      return leftValues[bIndex] - leftValues[aIndex];

    });
  }

  private updateBackground(): void {
    this.offset -= this.speed;
    if (this.offset <= -window.innerWidth) {
      this.offset = 0;
    }
    this.renderer.setStyle(this.background, 'backgroundPositionX', `${this.offset}px`);
  }

  private updateBillboard(): void {
    this.offset -= this.speed;
    if (this.offset <= -window.innerWidth) {
      this.offset = 0;
    }
    this.renderer.setStyle(this.billboard, 'backgroundPositionX', `${this.offset}px`);
  }

  private updateSky(): void {
    this.offset -= this.speed;
    if (this.offset <= -window.innerWidth) {
      this.offset = 0;
    }
    this.renderer.setStyle(this.sky, 'backgroundPositionX', `${this.offset}px`);
  }

  private updateHorses(currentTime: number): void {
    if (currentTime - this.lastFrameTime > this.frameRate) {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.horses.forEach((horse) => {
        this.renderer.setStyle(horse, 'backgroundPositionX', `-${this.frameIndex * this.horseWidth}px`);
      });
      this.lastFrameTime = currentTime;
    }
  }

  private gameLoop(currentTime: number): void {
    this.updateBackground();
    this.updateBillboard();
    this.updateSky();
    this.updateHorses(currentTime);
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  windowMaximize() {
    const div = document.getElementById('myDiv');
    const leaderboard = document.getElementById('leaderboard');
    const game = document.getElementById('game');
    if (!document.fullscreenElement) {
      div?.requestFullscreen().catch(err => {
        console.error(`Error al intentar activar el modo de pantalla completa: ${err.message}`);
      });
      if (leaderboard) {
        leaderboard.style.height = '100%';
      }
      if (game) {
        game.style.height = '82%';
      }
    } else {
      document.exitFullscreen();
      if (leaderboard) {
        leaderboard.style.height = '100%';
      }
      if (game) {
        game.style.height = '500px';
      }
    }
  }

  toogleFloat() {
    this.scoreBoardFloat = !this.scoreBoardFloat;
  }
}
