#ifndef MAPSCENE_H
#define MAPSCENE_H

#include <QGraphicsScene>
#include "mapitem.h"

class MapScene : public QGraphicsScene
{
    Q_OBJECT

public:
    MapScene(QObject *parent = nullptr);
    MapScene(qreal x, qreal y, qreal width, qreal height, QObject *parent = 0);
    ~MapScene();
    MapItem *hoverItem = nullptr;

protected:
    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseMoveEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseReleaseEvent(QGraphicsSceneMouseEvent *event) override;

signals:
    void mouseReleased();

};

#endif // MAPSCENE_H
