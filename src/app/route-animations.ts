import {
    trigger,
    animate,
    transition,
    style,
    query,
    group
  } from '@angular/animations';

  export const fader = trigger('fadeAnimation', [
    transition('* <=> *', [

        /* order */

        /* 1 */ query(':enter, :leave', style({ position: 'fixed', width: '100%' })

          , { optional: true }),


        /* 2 */ group([  // block executes in parallel

          query(':enter', [

            style({ opacity:0 }),

            animate('0.50s ease-in-out', style({ opacity:1 }))

          ], { optional: true }),

          query(':leave', [

           style({ opacity:0 }),

            animate('0.5s ease-in-out', style({ opacity:0 }
          ))], { optional: true }),         

        ])

      ])
  ]);