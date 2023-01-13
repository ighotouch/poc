import React, { useCallback, useEffect, useMemo, useState } from 'react';
import WrapperWithTopNavigation from 'containers/WrapperWithTopNavigation';
import { useHistory, useParams, useLocation } from 'react-router';
import moment from 'moment';
import { ReactComponent as RightArrowIcon } from '../../assets/svg/arrow-right.svg';
import Form from '../../components/Form';
import { ReactComponent as CameraIcon } from '../../assets/svg/camera.svg';
import { ReactComponent as ImagePlaceholderIcon } from '../../assets/svg/image_placeholder.svg';
import { ReactComponent as NotesIcon } from '../../assets/svg/notes.svg';
import { ReactComponent as DeleteIcon } from '../../assets/svg/delete.svg';
import { useLoanDispatch } from '../../contexts/loanContext';
import useToast from '../../hooks/useToast';
import { INotificationDetails } from 'interfaces/loan';

const NotificationReply = () => {
  const { uploadAttachment, replyLoanComment } = useLoanDispatch();
  const Toast = useToast();

  const [loading, setLoading] = useState(false);
  const { push, goBack } = useHistory();
  const [comment, setComment] = useState('');
  const [documents, setDocuments] = useState<Array<any>>([]);
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progressBar, setProgressBar] = useState<number>(0);
  const [bar, setBar] = useState(0);

  const { id } = useParams<{ id: string }>();
  const { notification } = useLocation<{ notification: INotificationDetails }>().state;
  useEffect(() => {
    if (uploading) {
      let time = 0;
      const timer = setInterval(() => {
        time = time += 0.3;
        if (time < 10) {
          setProgressBar((prev) => {
            if (prev < 100) return prev + 1.67;
            return prev;
          });
        }

        if (time >= 10) {
          setProgressBar((prev) => {
            if (prev < 100) return prev + 0.67;
            return prev;
          });
        }
        if (time >= 30) {
          clearInterval(timer);
        }
      }, 300);

      return () => {
        clearInterval(timer);
      };
    }
  }, [uploading]);
  const handleCapture = async (target: any) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const files = target.files;
        const formData = new FormData();
        formData.append('file', file);

        const newUrl = URL.createObjectURL(file);
        const docs = [...documents];
        const meta = {
          url: newUrl,
          name: file.name,
          documentId: 'threadId',
          key: `${'threadId'}_${docs.length}`,
          lock: false,
        };
        docs.push(meta);
        setProgressBar(0);
        setDocuments(docs);
        let attach = [...attachments];
        setUploading(true);
        try {
          setLoading(true);
          let response = await uploadAttachment(formData);
          setLoading(false);
          if (response && response.statusCode === 200) {
            Toast.success('Upload successful');
            attach.push({ name: file.name, url: response.data.url });
            setAttachments(attach);
            setUploading(false);
            setProgressBar(100);

            setDocuments(
              docs.map((d) => {
                if (d.key === meta.key) {
                  d.lock = true;
                }
                return d;
              })
            );
            return;
          }
          return Toast.error('Can not add attachment at the moment');
        } catch (error) {
          setLoading(false);
          setProgressBar(0);
          Toast.error('An error occured while adding attachment, Please try later');
          setDocuments([]);
        }
      }
    }
  };
  const onDelete = (index: number, name: string) => {
    setDocuments((doc) => doc.filter((_, i) => i !== index));
    setAttachments((att) => att.filter((at) => at.name !== name));
  };

  const renderDocumentUpload = useCallback(() => {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{}}
      >
        <input
          accept="image/*"
          id="icon-button-file"
          type="file"
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => handleCapture(e.target)}
        />
        <div
          className="d-flex justify-content-end flex-grow-1"
          style={{ width: '100%', marginTop: 23, marginBottom: 13 }}
        >
          <CameraIcon /> <span className="ms-2">Take Photo</span>
        </div>
        <label htmlFor="icon-button-file" className="w-100">
          <div
            className="d-flex flex-row justify-content-center"
            style={{
              width: '100%',
              borderRadius: 3,
              border: '1px dashed #7F91A8',
              paddingTop: 9,
              paddingBottom: 9,
            }}
          >
            <div className="w-25">
              <ImagePlaceholderIcon />
            </div>

            <div className="d-flex flex-column justify-content-center align-items-center">
              <span style={{ color: '#7F91A8', fontSize: 14 }}>Browse file</span>
              <span style={{ color: '#7F91A8', fontSize: 8 }}>
                File format: JPG, PNG, GIF, PDF
              </span>
            </div>
            <div className="w-25"></div>
          </div>
        </label>
        <div className="my-4 w-100">
          {documents.map((d, i) => {
            return (
              <div className="mb-3" style={{ position: 'relative' }}>
                <div
                  key={`${d.name}${i}`}
                  className="w-100 d-flex flex-row align-items-center "
                  style={{
                    paddingTop: 12,
                    paddingBottom: 12,
                    backgroundColor: '#F2F6F9',
                    zIndex: 2,
                    borderRadius: '.25rem',
                  }}
                >
                  <div style={{ flex: 1, paddingLeft: 20 }}>
                    <NotesIcon />
                  </div>
                  <div className="d-flex flex-column" style={{ flex: 6 }}>
                    <span>{d.name}</span>
                    <span>{moment().format('DD mmm, YYYY')}</span>
                  </div>
                  <div
                    style={{ paddingRight: 22 }}
                    onClick={() => {
                      onDelete(i, d.name);
                    }}
                  >
                    <DeleteIcon />
                  </div>

                  <div
                    className="progress border-radius-0"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      zIndex: -1,
                      bottom: 0,
                      marginBottom: -4,
                      // backgroundColor: "transparent",
                    }}
                  >
                    <div
                      className="progress-bar border-radius-0"
                      role="progressbar"
                      style={{
                        borderRadius: '.25rem',
                        width: `${d.lock ? 100 : progressBar}%`,
                      }}
                      aria-valuenow={d.lock ? 100 : progressBar}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [documents, attachments, progressBar]);

  const formData = useMemo(() => {
    return [
      {
        id: 'comment',
        type: 'input',
        props: {
          label: 'Comment',
          placeholder: 'Comment ',
          name: 'message',
          value: comment,
          inputType: 'textArea',
          style: { height: 146, resize: 'none' },
        },
      },
      {
        id: 'type',
        type: 'custom',
        content: renderDocumentUpload(),
      },
    ];
  }, [comment, renderDocumentUpload]);

  const onChange = (id: string, text: string) => {
    if (id === 'comment') setComment(text);
  };
  const handleReply = async () => {
    if (comment) {
      setLoading(true);
      try {
        let data = {
          message: comment,
          attachments,
        };
        await replyLoanComment(id, data);
        setLoading(false);
        Toast.success('Response sent');
        setTimeout(() => {
          goBack();
        }, 3000);
      } catch (error) {
        setLoading(false);
        Toast.error('Error sending reply');
      }
    }
  };

  return (
    <WrapperWithTopNavigation title="Notifications" loading={loading}>
      <div className="mb-5">
        <div className="d-flex py-4" style={{ borderBottom: '1px solid  #E1E6ED' }}>
          <h4 className="mb-0 text-primary">{notification.subject}</h4>
        </div>
        <div className="mt-4">
          <div
            style={{ marginBottom: 8 }}
            className="d-flex justify-content-between align-items-center"
          >
            <div
              className="text-truncate  text-uppercase"
              style={{ fontSize: 10, color: '#848F9F' }}
            >
              <span style={{ color: 'var(--bs-primary)' }}>ADMIN</span>{' '}
              <span>{moment(notification.createdAt).format('DD MMM YYYY')}</span>
            </div>
            <div className="d-flex align-items-center" style={{ paddingLeft: 4 }}>
              <div
                style={{
                  fontSize: 10,
                  marginRight: 5,
                  color: 'var(--bs-primary)',
                }}
              >
                {moment(notification.createdAt).fromNow()}
              </div>
              <RightArrowIcon />
            </div>
          </div>

          <p style={{ fontSize: 14, color: '#353F50' }}>{notification.message}</p>
        </div>

        <Form
          data={formData}
          onInputChanged={onChange}
          buttonLabel={'Submit'}
          onSubmitPress={handleReply}
        />
      </div>
    </WrapperWithTopNavigation>
  );
};

export default NotificationReply;
