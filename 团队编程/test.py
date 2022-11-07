"""
This code uses the pytorch model to detect faces from live video or camera.
"""
import argparse
import sys
import cv2
import face_recognition
import os
from vision.ssd.config.fd_config import define_img_size
from vision.ssd.mb_tiny_fd import create_mb_tiny_fd, create_mb_tiny_fd_predictor
from vision.ssd.mb_tiny_RFB_fd import create_Mb_Tiny_RFB_fd, create_Mb_Tiny_RFB_fd_predictor
from vision.utils.misc import Timer

os.environ["CUDA_VISIBLE_DEVICES"] = "0"
parser = argparse.ArgumentParser(
    description='detect_video')

parser.add_argument('--net_type', default="RFB", type=str,
                    help='The network architecture ,optional: RFB (higher precision) or slim (faster)')
parser.add_argument('--input_size', default=480, type=int,
                    help='define network input size,default optional value 128/160/320/480/640/1280')
parser.add_argument('--threshold', default=0.6, type=float,
                    help='score threshold')
parser.add_argument('--candidate_size', default=1000, type=int,
                    help='nms candidate size')
parser.add_argument('--path', default="imgs", type=str,
                    help='imgs dir')
parser.add_argument('--test_device', default="cuda:0", type=str,
                    help='cuda:0 or cpu')
parser.add_argument('--video_path', default="class2.mp4", type=str,
                    help='path of video')
args = parser.parse_args()

input_img_size = args.input_size
define_img_size(input_img_size)  # must put define_img_size() before 'import create_mb_tiny_fd, create_mb_tiny_fd_predictor'

label_path = "./models/voc-model-labels.txt"

net_type = args.net_type

cap = cv2.VideoCapture(0)  # capture from video
# cap = cv2.VideoCapture(0)  # capture from cameraq

class_names = [name.strip() for name in open(label_path).readlines()]
num_classes = len(class_names)
test_device = args.test_device

candidate_size = args.candidate_size
threshold = args.threshold

if net_type == 'slim':
    model_path = "models/pretrained/version-slim-320.pth"
    # model_path = "models/pretrained/version-slim-640.pth"
    net = create_mb_tiny_fd(len(class_names), is_test=True, device=test_device)
    predictor = create_mb_tiny_fd_predictor(net, candidate_size=candidate_size, device=test_device)
elif net_type == 'RFB':
    model_path = "models/pretrained/version-RFB-320.pth"
    # model_path = "models/pretrained/version-RFB-640.pth"
    net = create_Mb_Tiny_RFB_fd(len(class_names), is_test=True, device=test_device)
    predictor = create_Mb_Tiny_RFB_fd_predictor(net, candidate_size=candidate_size, device=test_device)
else:
    print("The net type is wrong!")
    sys.exit(1)
net.load(model_path)

timer = Timer()
sum = 0

face_names = []
face_codings = []
person_list = os.listdir("faces/")

for i in range(len(person_list)):
    person_name = os.listdir("faces/" + "person_" + str(i + 1))
    # print(person_name[0])
    face_img = face_recognition.load_image_file("faces/" + "person_" + str(i + 1) + "/" + person_name[0])
    face_codings.append(face_recognition.face_encodings(face_img)[0])
    face_names.append(person_name[0][:person_name[0].index(".")])

while True:
    #读取图像数据
    name = []
    ret, orig_image = cap.read()
    if orig_image is None:
        print("end")
        break
    image = cv2.cvtColor(orig_image, cv2.COLOR_BGR2RGB)
    # image = cv2.resize(orig_image, (0, 0), fx=0.25, fy=0.25)
    timer.start()
    boxes, labels, probs = predictor.predict(image, candidate_size / 2, threshold)
    np_boxes = boxes.numpy()
    if np_boxes.size:
        np_boxes = np_boxes[:,[1,3,2,0]]
    print(np_boxes)
    codings = face_recognition.face_encodings(image, np_boxes)
    for coding in codings:
        result = face_recognition.compare_faces(face_codings, coding, 0.62)
        print(result)
        for i in range(len(result)):
            if result[i]:
                name.append(face_names[i])
                # name[j] = face_names[i]
                break
            if i == len(result) - 1:
                mystr = "unknow"
                name.append(mystr)
                # name[j] = "unknown"

    interval = timer.end()
    print('Time: {:.6f}s, Detect Objects: {:d}.'.format(interval, labels.size(0)))
    j=0
    for i in range(boxes.size(0)):
        box = boxes[i, :]
        label = f" {probs[i]:.2f}"
        cv2.rectangle(orig_image, (int(box[0]), int(box[1])), (int(box[2]), int(box[3])), (0, 255, 0), 1)

        cv2.putText(orig_image, name[j],
                    (int(box[0]), int(box[1] - 10)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,  # font scale
                    (0, 0, 255),
                    1)  # line type
        j+=1
    orig_image = cv2.resize(orig_image, None, None, fx=0.8, fy=0.8)
    sum += boxes.size(0)
    cv2.imshow('annotated', orig_image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()
print("all face num:{}".format(sum))