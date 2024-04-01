import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api.service';

declare var paypal;

@Component({
  selector: 'app-payme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payme.component.html',
  styleUrl: './payme.component.css',
})
export class PaymeComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  product = {
    price: 15.0,
    description: 'DeckGPT Premium',
  };

  paidFor = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.product.description,
                amount: {
                  currency_code: 'USD',
                  value: this.product.price,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
          this.paidFor = true;

          // Upgrade user role
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(this.paypalElement.nativeElement);
  }
}
