import React, { useEffect, useState } from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';
import { Job } from '@src/models/Job';
import ImageViewer from './ImageViewer';

interface JobProps {
  match?: { params: { id: string } };
}

const Job: React.FC<JobProps> = (props: JobProps) => {
  const [image, setImage] = useState<string>();
  const jobs = useSelector((state: RootStateOrAny) => state.jobs.jobs);

  useEffect(() => {
    if (!props || !props.match || !props.match.params) {
      return;
    }
    const id = props.match.params.id;
    const job = jobs.find((x: Job) => x.id === id);
    setImage(job.image);
  }, [props, jobs]);

  return <ImageViewer image={image} />;
};

export default Job;
