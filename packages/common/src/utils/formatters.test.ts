import { AppRoute } from '@openmsupply-client/config';
import { RouteBuilder } from './formatters';

describe('Formatters', () => {
  it('builds a route with an appended wildcard', () => {
    expect(
      RouteBuilder.create(AppRoute.Customers)
        .addPart(AppRoute.OutboundShipment)
        .addWildCard()
        .build()
    ).toBe('/customers/outbound-shipment/*');
  });

  it('builds a route', () => {
    expect(
      RouteBuilder.create(AppRoute.Customers)
        .addPart(AppRoute.OutboundShipment)
        .build()
    ).toBe('/customers/outbound-shipment');
  });

  it('can be used to create multiple routes from the same builder', () => {
    expect(RouteBuilder.create(AppRoute.Customers).build()).toBe('/customers');
    expect(RouteBuilder.create(AppRoute.Suppliers).build()).toBe('/suppliers');
  });
});
