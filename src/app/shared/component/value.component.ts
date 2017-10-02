import { Component, Input, OnInit } from "@angular/core";
import { TreeLeaf } from "../class/tree/tree-leaf";
import { Soap } from "../class/helper/soap";

@Component({
  selector: 'my-value',
  templateUrl: 'value.component.html',
  styleUrls: ['value.component.scss']
})

export class ValueComponent implements OnInit{
  @Input() leaf: TreeLeaf;
  @Input() showFullName: boolean = false;
  private initVal: any;
  private currVal: any;

  private boolVal: boolean;

  constructor(){
  }

  ngOnInit(): void {
    this.leaf.value.subscribe(val => {
      this.currVal=val;
      this.initVal=val;
      if(this.leaf.type == 'xsd:boolean'){
        this.boolVal = this.initVal == 1;
      }
    });

  }

  private sendBool(e: MouseEvent){
    e.stopPropagation();
    this.leaf.send(!this.boolVal);
    setTimeout(()=>this.leaf.query(),135);
  }

}
