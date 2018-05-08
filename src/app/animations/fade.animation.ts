
import { trigger, animate, transition, style, query, group } from '@angular/animations';

export const fadeAnimation =

    trigger('fadeAnimation', [
    transition('* => *', [
        query(':enter', [
                style({ opacity: 0 })
            ], { optional: true }
        ),
        group([
            query(':leave', [
                    animate(300, style({ opacity: 0 }))
                ],
                { optional: true }
            ),
            query(':enter', [
                    style({ opacity: 0 }),
                    animate(300, style({ opacity: 1 }))
                ],
                { optional: true }
            )
        ])
    ])
]);