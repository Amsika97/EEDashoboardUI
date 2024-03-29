import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomPaginatorIntlService extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Show';

  
}