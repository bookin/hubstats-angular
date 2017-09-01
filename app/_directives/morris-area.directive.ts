import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

declare let Morris: any;
declare let jQuery: any;

@Directive({
    selector: '[morris-area]'
})
export class MorrisAreaDirective implements AfterViewInit{
    @Input() name: string;
    @Input() data: string;

    constructor(el: ElementRef) {
        el.nativeElement.style.height = '250px';
        el.nativeElement.id = this.name;
    }

    ngAfterViewInit() {
        new Morris.Area({
            'element':this.name,
            'data':JSON.parse(this.data),
            'xkey':'x',
            'ykeys':['count', 'uniques'],
            'labels':['Visits', 'Uniques'],
            'xLabels':'day',
            'behaveLikeLine':true,
            'dateFormat':function(x:string){
                let date = new Date(x);
                return ('0' + (date.getMonth() + 1)).slice(-2) + '/' +  ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear().toString().replace(new RegExp('^.{2}'), '');
            },
            'lineColors':['#28A745', '#005CC5'],
            'lineWidth':2,
            'hideHover':true,
            'fillOpacity':0,
            'resize':true
        });
    }
}