#ifndef MAPVIEW_H
#define MAPVIEW_H

#include <QGraphicsView>

class MapView : public QGraphicsView
{
    Q_OBJECT

public:
    MapView(QGraphicsScene *Scene, QWidget *parent = nullptr);
    MapView(QWidget *parent = 0);
    ~MapView();

protected:
    void mousePressEvent(QMouseEvent *event) override;
    void mouseMoveEvent(QMouseEvent *event) override;
    void wheelEvent(QWheelEvent *event) override;

};

#endif // MAPVIEW_H
