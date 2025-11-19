import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Catch } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class ExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: RpcException): Observable<any> {
    return throwError(() => exception);
  }
}
