import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import { PointResult } from '@src/models/Result';

interface PointResultProps {
  result?: PointResult;
}

const PointResultPanel: React.FC<PointResultProps> = (props: PointResultProps) => {
  const point = props.result?.point;

  return (
    <TableContainer component={Box}>
      <Table size="small">
        {point && (
          <TableBody>
            {point.x && point.y && (
              <TableRow>
                <TableCell component="th" scope="row">
                  {'(x,y)'}
                </TableCell>
                <TableCell>{`(${point.x}, ${point.y})`}</TableCell>
              </TableRow>
            )}
            {point.r && (
              <TableRow>
                <TableCell component="th" scope="row">
                  {'r'}
                </TableCell>
                <TableCell>{point.r}</TableCell>
              </TableRow>
            )}
            {point.g && (
              <TableRow>
                <TableCell component="th" scope="row">
                  {'g'}
                </TableCell>
                <TableCell>{point.g}</TableCell>
              </TableRow>
            )}
            {point.b && (
              <TableRow>
                <TableCell component="th" scope="row">
                  {'b'}
                </TableCell>
                <TableCell>{point.b}</TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default PointResultPanel;
