import React, { FC, useEffect } from 'react';
import {
  useTranslation,
  useBreadcrumbs,
  DetailContainer,
  DetailInputWithLabelRow,
  DetailSection,
  Checkbox,
  Grid,
  Formatter,
  Typography,
  Box,
  BasicSpinner,
  MuiLink,
} from '@openmsupply-client/common';
import { useName } from '../api';

interface DetailModalProps {
  nameId: string;
}

export const DetailModal: FC<DetailModalProps> = ({ nameId }) => {
  const { data, isLoading } = useName(nameId);
  const t = useTranslation('common');
  const { setSuffix } = useBreadcrumbs();
  const isDisabled = true;

  useEffect(() => {
    setSuffix(data?.name ?? '');
  }, [data]);

  if (isLoading) return <BasicSpinner />;

  return !!data ? (
    <DetailContainer>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
          {data.name}
        </Typography>
        <Grid container flex={1} flexDirection="row" gap={4}>
          <DetailSection title="">
            <DetailInputWithLabelRow
              label={t('label.address')}
              inputProps={{ value: data?.address, disabled: isDisabled }}
            />
            <DetailInputWithLabelRow
              label={t('label.code')}
              inputProps={{ value: data?.code, disabled: isDisabled }}
            />
            <DetailInputWithLabelRow
              label={t('label.chargeCode')}
              inputProps={{ value: data?.chargeCode, disabled: isDisabled }}
            />
            <DetailInputWithLabelRow
              label={t('label.country')}
              inputProps={{ value: data?.country, disabled: isDisabled }}
            />
            <DetailInputWithLabelRow
              label={t('label.comment')}
              inputProps={{ value: data?.comment, disabled: isDisabled }}
            />
            <DetailInputWithLabelRow
              label={t('label.phone')}
              inputProps={{ value: data?.phone, disabled: isDisabled }}
            />
            <DetailInputWithLabelRow
              label={t('label.website')}
              inputProps={{ value: data?.website, disabled: isDisabled }}
              DisabledInput={
                <>
                  <MuiLink href={data.website} target="_blank" rel="noopener">
                    {data.website}
                  </MuiLink>
                </>
              }
            />
          </DetailSection>
          <DetailSection title="">
            <DetailInputWithLabelRow
              label={t('label.date-created')}
              inputProps={{
                value: data?.createdDate
                  ? Formatter.localisedDate(new Date(data?.createdDate))
                  : '',
                disabled: isDisabled,
              }}
            />
            <DetailInputWithLabelRow
              label={t('label.manufacturer')}
              Input={
                <Checkbox
                  disabled={isDisabled}
                  checked={data?.isManufacturer}
                />
              }
            />
            <DetailInputWithLabelRow
              label={t('label.donor')}
              Input={<Checkbox disabled={isDisabled} checked={data?.isDonor} />}
            />
            <DetailInputWithLabelRow
              label={t('label.on-hold')}
              Input={
                <Checkbox disabled={isDisabled} checked={data?.isOnHold} />
              }
            />
          </DetailSection>
        </Grid>
      </Box>
    </DetailContainer>
  ) : null;
};
