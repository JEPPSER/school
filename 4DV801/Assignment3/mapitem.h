#ifndef MAPITEM_H
#define MAPITEM_H

#include <QGraphicsItem>
#include <QPainter>

class MapItem : public QGraphicsObject
{
public:
    MapItem(QGraphicsItem *parent = nullptr);
    MapItem(qreal x, qreal y, int size, QGraphicsItem *parent = nullptr);

    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget = nullptr) override;
    QRectF boundingRect() const override;
    QColor color = Qt::blue;

private:
    QPolygonF shape;
};

#endif // MAPITEM_H
