import React, { FC } from 'react';
import {
  Collapse,
  List,
  useTranslation,
  RouteBuilder,
  AppNavLink,
  ListIcon,
} from '@openmsupply-client/common';
import { AppRoute } from '@openmsupply-client/config';
import { useNestedNav } from './useNestedNav';

export const CatalogueNav: FC = () => {
  const { isActive } = useNestedNav(
    RouteBuilder.create(AppRoute.Catalogue).addWildCard().build()
  );
  const t = useTranslation('app');

  return (
    <>
      <AppNavLink
        end={false}
        to={AppRoute.Catalogue}
        icon={<ListIcon color="primary" />}
        text={t('catalogue')}
        inactive
      />
      <Collapse in={isActive}>
        <List>
          <AppNavLink
            end
            to={RouteBuilder.create(AppRoute.Catalogue)
              .addPart(AppRoute.Items)
              .build()}
            text={t('items')}
          />
          <AppNavLink
            end
            to={RouteBuilder.create(AppRoute.Catalogue)
              .addPart(AppRoute.MasterLists)
              .build()}
            text={t('master-lists')}
          />
        </List>
      </Collapse>
    </>
  );
};
